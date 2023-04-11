class RemoveLevelFromLevel < ActiveRecord::Migration[7.0]
  def change
    remove_column :levels, :level, :integer
  end
end
